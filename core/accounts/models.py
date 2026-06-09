from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class User(AbstractUser):
    ROLE_CHOICES = (
        ('DOCTOR', 'Doctor'),
        ('PATIENT', 'Patient'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, null=True, blank=True)


class DoctorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    specialization = models.CharField(max_length=100)
    experience = models.IntegerField()
    consultation_fee = models.IntegerField()
    is_available = models.BooleanField(default=True)