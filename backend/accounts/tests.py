from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class AdminCredentialsTest(TestCase):
    def test_admin_can_log_in(self):
        user = authenticate(username='admin', password='admin@123')
        self.assertIsNotNone(user)
        self.assertTrue(user.is_superuser)
        self.assertEqual(user.email, 'admin@gmail.com')

    def test_admin_can_log_in_with_email(self):
        client = APIClient()
        response = client.post('/api/accounts/login/', {
            'username': 'admin@gmail.com',
            'password': 'admin@123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'admin')


class RegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_can_register(self):
        response = self.client.post('/api/accounts/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'NewPass123',
            'password_confirm': 'NewPass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'newuser@example.com')
        self.assertTrue(user.check_password('NewPass123'))

    def test_duplicate_registration_rejected(self):
        User.objects.create_user(username='dupuser', email='dup@example.com', password='Pass123')
        response = self.client.post('/api/accounts/register/', {
            'username': 'dupuser',
            'email': 'other@example.com',
            'password': 'Pass123',
            'password_confirm': 'Pass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_mismatch_rejected(self):
        response = self.client.post('/api/accounts/register/', {
            'username': 'mismatch',
            'email': 'mismatch@example.com',
            'password': 'Pass123',
            'password_confirm': 'Different',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_endpoint(self):
        User.objects.create_user(username='loguser', email='log@example.com', password='Pass123')
        response = self.client.post('/api/accounts/login/', {
            'username': 'loguser',
            'password': 'Pass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'loguser')

    def test_login_bad_password_rejected(self):
        User.objects.create_user(username='baduser', email='bad@example.com', password='Pass123')
        response = self.client.post('/api/accounts/login/', {
            'username': 'baduser',
            'password': 'wrong',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
