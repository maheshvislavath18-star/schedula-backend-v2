from django.urls import path
from .views import (
    SignupView,
    DoctorProfileView,
    PatientProfileView
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('doctor/profile/', DoctorProfileView.as_view()),
    path('patient/profile/', PatientProfileView.as_view()),
]