import requests
import time
from collections import Counter

def test_round_robin():
    """Test du load balancing Round Robin"""
    url = "http://localhost:8000/api/health-check/"
    servers = Counter()

    print("=== Testing Round Robin load balancing ===")
    for i in range(30):
        try:
            response = requests.get(url)
            print(f"Request {i+1}: Status code {response.status_code}")
            if response.status_code == 200:
                server_id = response.headers.get('X-Server-ID', 'unknown')
                try:
                    data = response.json()
                    status = data.get('status', 'unknown')
                    servers[server_id] += 1
                    print(f"Request {i+1}: Server {server_id} responded with status '{status}'")
                except ValueError:
                    print(f"Request {i+1}: Server {server_id} returned non-JSON response: {response.text[:100]}")
                    servers[server_id] += 1
            else:
                print(f"Request {i+1}: Error - HTTP {response.status_code}")
        except Exception as e:
            print(f"Request {i+1}: Error - {str(e)}")
        time.sleep(0.1)

    if servers:
        print("\n=== Distribution des requêtes ===")
        total = sum(servers.values())
        for server, count in servers.items():
            print(f"Server {server}: {count} requêtes ({count/total*100:.1f}%)")
    else:
        print("\nAucune requête n'a été traitée correctement.")

def test_celery_queue():
    """Test du messaging queue (Celery/RabbitMQ)"""
    url = "http://localhost:8000/api/test-celery/"
    print("\n=== Testing Celery messaging queue ===")
    for i in range(10):
        try:
            response = requests.post(url)
            print(f"Request {i+1}: Status code {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"Request {i+1}: Error - {str(e)}")
        time.sleep(0.1)

if __name__ == "__main__":
    test_round_robin()
    test_celery_queue()