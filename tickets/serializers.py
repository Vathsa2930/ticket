from rest_framework import serializers
from .models import Ticket, Message
from user_profile.serializers import UserSerializer
from user_profile.models import User

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'ticket', 'user', 'message', 'timestamp']
        read_only_fields = ('id', 'user', 'timestamp')

class TicketSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_support=True),
        source='assigned_to',
        write_only=True,
        allow_null=True,  
        required=False
    )

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'status', 'created_by', 'assigned_to', 'created_at', 'messages', 'attachment', 'assigned_to_id']
