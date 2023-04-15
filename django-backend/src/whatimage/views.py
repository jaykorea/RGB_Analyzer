from django.http import JsonResponse
import socket
import fcntl
import struct

network_interface_name = b'ens259f1'

def get_req_public_url(request):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    ip_address = socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,  # SIOCGIFADDR
        struct.pack('16s', network_interface_name)
    )[20:24])
    req_url = 'http://' + ip_address + ':8001'
    return JsonResponse({'req_url': req_url})

def get_req_local_url(request):
    return JsonResponse({'req_url': 'http://127.0.0.1:8001'})

def get_req_dns_url(request):
    return JsonResponse({'req_url': 'https://www.zeroexposure1905.com'})
