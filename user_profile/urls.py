
from django.urls import path
from .views import UserCreate, SupportAgentListView

urlpatterns = [
   
    path('register/', UserCreate.as_view(), name='user-register'),
    path('support-agents/', SupportAgentListView.as_view(), name='support-agent-list'),
]
