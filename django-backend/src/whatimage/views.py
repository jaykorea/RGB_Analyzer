from django.http import JsonResponse
import socket
import fcntl
import struct

def get_eth0_ip(request):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    eth0_ip = socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,  # SIOCGIFADDR
        struct.pack('256s', b'eth0') # Note: use b'eth0' instead of 'eth0'
    )[20:24])
    return JsonResponse({'eth0_ip': eth0_ip})
