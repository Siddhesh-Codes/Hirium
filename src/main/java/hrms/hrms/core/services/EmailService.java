package hrms.hrms.core.services;

public interface EmailService {
    void sendWelcomeEmail(String toEmail, String employeeName, String companyName, String temporaryPassword);
}
