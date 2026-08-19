from app.core.logger import get_logger

logger = get_logger(__name__)


def send_email(to: str, subject: str, body: str) -> None:
    """Stub email sender. Currently logs the message instead of actually
    sending it, since no email provider is configured yet.

    To go live: sign up for a transactional email provider (Resend,
    SendGrid, AWS SES, Postmark), then replace the body of this function
    with a call to their API. Keep the same signature so nothing else
    in the codebase needs to change.
    """
    logger.info("EMAIL (stub, not actually sent)\nTo: %s\nSubject: %s\n%s", to, subject, body)