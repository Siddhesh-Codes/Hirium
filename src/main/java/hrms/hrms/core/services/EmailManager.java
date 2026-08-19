package hrms.hrms.core.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailManager implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailManager.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username:noreply@system.local}")
    private String fromEmail;

    @Override
    @Async
    public void sendWelcomeEmail(String toEmail, String employeeName, String companyName, String temporaryPassword) {
        String company = (companyName != null && !companyName.isBlank()) ? companyName : "Hirium Enterprise";
        String subject = "Welcome to " + company + " — Your Hirium HRMS Login Details";

        String portalUrl = frontendUrl + "/login";

        String body = String.format("""
            Dear %s,

            Welcome to %s! Your official employee account has been created on our Hirium Human Resource Management System.

            Here are your access details to sign in to your employee workspace:

            --------------------------------------------------
            Portal URL: %s
            Username: %s
            Temporary Password: %s
            --------------------------------------------------

            IMPORTANT: For account security, you will be prompted to set your new private password upon your first login.

            Once logged in, you can:
            - Punch in and out for your daily shift
            - Apply for leave and track remaining quota
            - Access and print your monthly salary slips

            Best regards,
            %s Human Resources Team
            Powered by Hirium Enterprise HRMS
            """,
            employeeName,
            company,
            portalUrl,
            toEmail,
            temporaryPassword,
            company
        );

        logger.info("\n=======================================================\n" +
                    "DISPATCHING AUTOMATED ONBOARDING EMAIL TO: {}\n" +
                    "SUBJECT: {}\n" +
                    "-------------------------------------------------------\n" +
                    "{}\n" +
                    "=======================================================\n",
                toEmail, subject, body);

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                logger.info("Welcome email successfully sent to {}", toEmail);
            } catch (Exception e) {
                logger.warn("Could not dispatch live SMTP email to {} (SMTP not configured or offline): {}", toEmail, e.getMessage());
            }
        }
    }
}
