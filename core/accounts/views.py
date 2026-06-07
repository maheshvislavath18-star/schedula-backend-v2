from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import SignupSerializer
from .permissions import IsDoctor, IsPatient

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer


class DoctorProfileView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        return Response({
            "message": "Doctor Profile Access Granted"
        })


class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        return Response({
            "message": "Patient Profile Access Granted"
        })