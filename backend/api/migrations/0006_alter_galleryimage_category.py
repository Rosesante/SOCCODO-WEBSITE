from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_event'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AlterField(
                    model_name='galleryimage',
                    name='category',
                    field=models.CharField(
                        choices=[
                            ('Community Development', 'Community Development'),
                            ('Climate & Environment', 'Climate & Environment'),
                            ('Education & Youth', 'Education & Youth'),
                            ('Women & Social Welfare', 'Women & Social Welfare'),
                            ('Water & Sanitation', 'Water & Sanitation'),
                            ('Disaster Relief', 'Disaster Relief'),
                        ],
                        default='Community Development',
                        max_length=50,
                    ),
                ),
            ],
        ),
    ]