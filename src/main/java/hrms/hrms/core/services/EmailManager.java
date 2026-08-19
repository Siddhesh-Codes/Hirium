package hrms.hrms.core.services;

import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailManager implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailManager.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:https://hirium.vercel.app}")
    private String frontendUrl;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${spring.mail.username:siddhesh.dev21@gmail.com}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Override
    @Async
    public void sendWelcomeEmail(String toEmail, String employeeName, String companyName, String temporaryPassword) {
        String company = (companyName != null && !companyName.isBlank()) ? companyName : "Hirium Enterprise";
        String subject = "Welcome to " + company + " — Your Hirium HRMS Login Details";

        String portalUrl = (frontendUrl != null && !frontendUrl.isBlank() ? frontendUrl : "https://hirium.vercel.app") + "/login";

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

        logger.info("Dispatching welcome email to: {} for company: {}", toEmail, company);

        try {
            String effectiveUsername = (mailUsername != null && !mailUsername.isBlank()) ? mailUsername.trim() : "siddhesh.dev21@gmail.com";
            String effectivePassword = (mailPassword != null && !mailPassword.isBlank()) ? mailPassword.replaceAll("\\s+", "") : "";

            JavaMailSender activeSender = this.mailSender;

            // Fallback dynamic sender initialization
            if (activeSender == null && !effectivePassword.isBlank()) {
                JavaMailSenderImpl impl = new JavaMailSenderImpl();
                impl.setHost(mailHost != null ? mailHost.trim() : "smtp.gmail.com");
                impl.setPort(mailPort > 0 ? mailPort : 587);
                impl.setUsername(effectiveUsername);
                impl.setPassword(effectivePassword);

                Properties props = impl.getJavaMailProperties();
                props.put("mail.transport.protocol", "smtp");
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.starttls.required", "true");
                props.put("mail.smtp.connectiontimeout", "5000");
                props.put("mail.smtp.timeout", "5000");
                props.put("mail.smtp.writetimeout", "5000");
                activeSender = impl;
            }

            if (activeSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(effectiveUsername);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                activeSender.send(message);
                logger.info("SUCCESS: Automated onboarding email delivered to {}", toEmail);
            } else {
                logger.warn("SMTP email skipped: SPRING_MAIL_PASSWORD environment variable is empty on this server.");
            }
        } catch (Exception e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
