from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import DoctorProfile

User = get_user_model()


# ---------------- SIGNUP ----------------
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# ---------------- DOCTOR SERIALIZER ----------------
class DoctorSerializer(serializers.ModelSerializer):
    doctor_id = serializers.IntegerField(source='id')
    full_name = serializers.CharField(source='user.get_full_name')

    class Meta:
        model = DoctorProfile
        fields = [
            'doctor_id',
            'full_name',
            'specialization',
            'experience',
            'consultation_fee',
            'is_available'
        ]