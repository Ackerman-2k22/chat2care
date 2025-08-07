# api-gateway/apps/gateway/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from django.core.cache import cache
import httpx
import asyncio
from datetime import datetime


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check de l'API Gateway"""
    checks = {
        'gateway': 'healthy',
        'database': check_database(),
        'cache': check_cache(),
        'timestamp': datetime.now().isoformat()
    }

    all_healthy = all(v == 'healthy' for k, v in checks.items() if k != 'timestamp')
    status_code = 200 if all_healthy else 503

    return Response(checks, status=status_code)


@api_view(['GET'])
@permission_classes([AllowAny])
def service_status(request):
    """Vérification du statut des microservices"""
    services_health = asyncio.run(check_all_services())

    all_healthy = all(s['status'] == 'healthy' for s in services_health.values())
    status_code = 200 if all_healthy else 503

    return Response({
        'services': services_health,
        'overall_status': 'healthy' if all_healthy else 'degraded',
        'timestamp': datetime.now().isoformat()
    }, status=status_code)


def check_database():
    """Vérifie la connexion à la base de données"""
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return 'healthy'
    except:
        return 'unhealthy'


def check_cache():
    """Vérifie la connexion au cache Redis"""
    try:
        cache.set('health_check', 'ok', 1)
        if cache.get('health_check') == 'ok':
            return 'healthy'
        return 'unhealthy'
    except:
        return 'unhealthy'


async def check_all_services():
    """Vérifie le statut de tous les microservices"""
    services = {}

    async with httpx.AsyncClient(timeout=5.0) as client:
        for service_name, service_url in settings.MICROSERVICES.items():
            try:
                response = await client.get(f"{service_url}/health/")
                services[service_name] = {
                    'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                    'response_time': response.elapsed.total_seconds(),
                    'status_code': response.status_code
                }
            except Exception as e:
                services[service_name] = {
                    'status': 'unhealthy',
                    'error': str(e),
                    'response_time': None
                }

    return services
