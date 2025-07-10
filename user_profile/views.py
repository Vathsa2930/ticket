from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class SupportAgentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(is_support=True)


from django.views.generic import View
from django.http import HttpResponse
import os
from django.conf import settings
BASE_DIR = settings.BASE_DIR

class FrontendAppView(View):
    def get(self, request):
        file_path = os.path.join(BASE_DIR, 'frontend', 'build', 'index.html')
        print("Looking for:", file_path)  # <--- Add this line
        try:
            with open(file_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("index.html not found", status=501)

        
        