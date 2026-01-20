# TessDental Update Protocol (Required)

TessDental updates must be:
- atomic (blue/green)
- validated (smoke tests)
- rollback-safe (one click)
- gated by backups (verified)

High level:
1) Verify backups are healthy
2) Take fresh pre-upgrade backup
3) Pull images by digest from signed manifest
4) Stage green stack + run DB migrations safely
5) Run smoke tests
6) Switch traffic
7) Keep blue for rollback window
