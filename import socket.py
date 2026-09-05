import socket

domain = input(https://smpit-abubakar.sch.id/)

try:
    ip = socket.gethostbyname(domain)
    print(f"IP website: {ip}")
except socket.gaierror:
    print("Domain tidak ditemukan.")