
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_activity'),
        ('api', '0003_delete_contactmessage'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactMessage',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('full_name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254)),
                (
                    'support_type',
                    models.CharField(
                        choices=[
                            ('Donation / Financial Support', 'Donation / Financial Support'),
                            ('Volunteer', 'Volunteer'),
                            ('Partnership', 'Partnership'),
                            ('Project Sponsorship', 'Project Sponsorship'),
                            ('Supplies / Equipment', 'Supplies / Equipment'),
                            ('Professional Skills / Services', 'Professional Skills / Services'),
                            ('Shopping / Other Resources', 'Shopping / Other Resources'),
                            ('Other Support', 'Other Support'),
                        ],
                        max_length=100,
                    ),
                ),
                ('subject', models.CharField(max_length=200)),
                ('message', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Contact Message',
                'verbose_name_plural': 'Contact Messages',
                'ordering': ['-created_at'],
            },
        ),
    ]
