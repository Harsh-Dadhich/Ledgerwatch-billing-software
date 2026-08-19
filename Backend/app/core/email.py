# from app.core.logger import get_logger

# logger = get_logger(__name__)


# def send_email(to: str, subject: str, body: str) -> None:
#     """Stub email sender. Currently logs the message instead of actually
#     sending it, since no email provider is configured yet.

#     To go live: sign up for a transactional email provider (Resend,
#     SendGrid, AWS SES, Postmark), then replace the body of this function
#     with a call to their API. Keep the same signature so nothing else
#     in the codebase needs to change.
#     """
#     logger.info("EMAIL (stub, not actually sent)\nTo: %s\nSubject: %s\n%s", to, subject, body)

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)


def send_email(to: str, subject: str, body: str) -> None:
    """Sends a real email via SMTP if credentials are configured.
    Falls back to logging the message if SMTP isn't set up, or if
    sending fails -- an email hiccup should never break the request
    that triggered it (e.g. password reset should still "succeed" from
    the user's point of view even if SMTP is temporarily down).
    """
    if not settings.smtp_server or not settings.sender_email or not settings.password:
        logger.info("EMAIL (SMTP not configured, not sent)\nTo: %s\nSubject: %s\n%s", to, subject, body)
        return

    message = MIMEMultipart()
    message["From"] = settings.sender_email
    message["To"] = to
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(settings.smtp_server, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.sender_email, settings.password)
            server.send_message(message)
        logger.info("Email sent to=%s subject=%s", to, subject)
    except Exception:
        logger.exception("Failed to send email to=%s subject=%s", to, subject)