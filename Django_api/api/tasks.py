from celery import shared_task

@shared_task
def addition(x, y):
    print(f"Addition: {x} + {y} = {x + y}")
    return x + y