from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, MessageListCreateView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('tickets/<int:ticket_id>/messages/', MessageListCreateView.as_view(), name='ticket-messages'),
]
