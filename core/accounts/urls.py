from django.urls import path
from .views import (
    SignupView,
    DoctorProfileView,
    PatientProfileView,
    DoctorListView,
    DoctorDetailView
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # ---------------- AUTH ----------------
    path('signup/', SignupView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    # ---------------- USER PROFILES ----------------
    path('doctor/profile/', DoctorProfileView.as_view()),
    path('patient/profile/', PatientProfileView.as_view()),

    # ---------------- DAY 4 DOCTOR DISCOVERY ----------------
    path('doctor/', DoctorListView.as_view()),              # list + filter + search + pagination
    path('doctor/<int:id>/', DoctorDetailView.as_view()),   # detail
]