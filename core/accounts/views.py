from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator, EmptyPage

from .serializers import SignupSerializer, DoctorSerializer
from .models import DoctorProfile
from .permissions import IsDoctor, IsPatient


# -----------------------------
# SIGNUP
# -----------------------------
class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer


# -----------------------------
# DOCTOR PROFILE (LOGIN USER)
# -----------------------------
class DoctorProfileView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        return Response({
            "message": "Doctor Profile Access Granted"
        })


# -----------------------------
# PATIENT PROFILE (LOGIN USER)
# -----------------------------
class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        return Response({
            "message": "Patient Profile Access Granted"
        })


# ======================================================
# 🔥 DAY 4 MAIN FEATURE: DOCTOR DISCOVERY API
# ======================================================

class DoctorListView(APIView):

    def get(self, request):

        doctors = DoctorProfile.objects.select_related("user").all()

        # ---------------- FILTER: specialization ----------------
        specialization = request.GET.get("specialization")
        if specialization:
            doctors = doctors.filter(specialization__iexact=specialization)

        # ---------------- SEARCH: name ----------------
        search = request.GET.get("search")
        if search:
            doctors = doctors.filter(user__first_name__icontains=search) | \
                       doctors.filter(user__last_name__icontains=search)

        # ---------------- AVAILABILITY ----------------
        availability = request.GET.get("availability")
        if availability is not None:
            if availability.lower() == "true":
                doctors = doctors.filter(is_available=True)
            elif availability.lower() == "false":
                doctors = doctors.filter(is_available=False)

        # ---------------- NO DATA ----------------
        if not doctors.exists():
            return Response({"message": "No doctors found"}, status=404)

        # ---------------- PAGINATION ----------------
        page = request.GET.get("page", 1)
        limit = request.GET.get("limit", 10)

        try:
            page = int(page)
            limit = int(limit)

            if page <= 0 or limit <= 0:
                return Response({"message": "Invalid pagination values"}, status=400)

        except ValueError:
            return Response({"message": "Invalid pagination input"}, status=400)

        paginator = Paginator(doctors, limit)

        try:
            doctors_page = paginator.page(page)
        except EmptyPage:
            return Response({"message": "Page not found"}, status=404)

        serializer = DoctorSerializer(doctors_page, many=True)

        return Response({
            "total": paginator.count,
            "page": page,
            "limit": limit,
            "results": serializer.data
        })


# -----------------------------
# DOCTOR DETAIL API
# -----------------------------
class DoctorDetailView(APIView):

    def get(self, request, id):
        try:
            doctor = DoctorProfile.objects.select_related("user").get(id=id)
        except DoctorProfile.DoesNotExist:
            return Response({"message": "Doctor not found"}, status=404)

        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)