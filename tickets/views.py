from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Ticket, Message
from .serializers import TicketSerializer, MessageSerializer
from .permissions import IsOwnerOrSupport

class TicketViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrSupport]

    def get_queryset(self):
        user = self.request.user
        if user.is_support:
            # Support users can see all tickets, filtered by status if provided.
            status = self.request.query_params.get('status', None)
            if status:
                return Ticket.objects.filter(status=status)
            return Ticket.objects.all()
        
        # Customers can only see their own tickets.
        return Ticket.objects.filter(created_by=user)

    def update(self, request, *args, **kwargs):
        if not request.user.is_support:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        Set the creator of the ticket to the current user.
        """
        serializer.save(created_by=self.request.user)


class MessageListCreateView(generics.ListCreateAPIView):
    """
    View to list all messages in a ticket or create a new one.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the messages for
        the ticket as determined by the ticket_id portion of the URL.
        """
        ticket_id = self.kwargs['ticket_id']
        try:
            ticket = Ticket.objects.get(pk=ticket_id)
        except Ticket.DoesNotExist:
            return Message.objects.none()
        
        # Check if user has permission to view the ticket's messages
        if not (self.request.user.is_support or ticket.created_by == self.request.user):
            return Message.objects.none() # Return empty queryset if no permission
            
        return Message.objects.filter(ticket__id=ticket_id)

    def perform_create(self, serializer):
        """
        Create a new message and associate it with the ticket and user.
        """
        ticket_id = self.kwargs['ticket_id']
        try:
            ticket = Ticket.objects.get(pk=ticket_id)
        except Ticket.DoesNotExist:
            raise PermissionDenied("Ticket not found.")

        # Check if user has permission to post to the ticket
        if not (self.request.user.is_support or ticket.created_by == self.request.user):
            raise PermissionDenied("You do not have permission to post a message to this ticket.")
            
        serializer.save(user=self.request.user, ticket=ticket)
