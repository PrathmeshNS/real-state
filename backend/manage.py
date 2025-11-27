#!/usr/bin/env python
"""Django's command-line utility for administrative tasks.

This file includes a small convenience for hosting platforms that call
`python manage.py runserver` without a host/port argument: if `PORT` is
set in the environment, the command will bind to `0.0.0.0:$PORT`. It also
ensures `collectstatic` and `migrate` are run before `runserver` for
convenience when the start command doesn't explicitly run them.
"""
import os
import sys


def main():
    """Run administrative tasks.

    Special handling:
    - If `runserver` is used without host:port args, and $PORT is set,
      append `0.0.0.0:$PORT` to the argv so the app binds to the port
      provided by the hosting platform.
    - If `runserver` will be executed, ensure `collectstatic` and
      `migrate` are executed first so static files exist and DB is migrated.
    """

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'realestate.settings')
    try:
        from django.core.management import execute_from_command_line, call_command
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # If the hosting platform calls `python manage.py runserver` with no
    # arguments, add a default binding to the $PORT environment variable
    # (if present). This helps on platforms like Render that expect the
    # app to bind to 0.0.0.0:$PORT.
    argv = sys.argv[:]  # copy
    if len(argv) >= 2 and argv[1] == 'runserver':
        # If no `host:port` provided, append the port
        if len(argv) == 2:
            port = os.environ.get('PORT', '8000')
            argv.append(f'0.0.0.0:{port}')

        # Run migrations & collectstatic before starting server to ensure
        # the environment is prepared even if the start command doesn't run them.
        try:
            print('[INFO] Running database migrations (pre-runserver)...')
            call_command('migrate', '--noinput')
        except Exception as e:
            print('[WARN] Pre-runserver migrate failed:', e)

        try:
            print('[INFO] Collecting static files (pre-runserver)...')
            call_command('collectstatic', '--noinput')
        except Exception as e:
            print('[WARN] Pre-runserver collectstatic failed:', e)

    execute_from_command_line(argv)


if __name__ == '__main__':
    main()
