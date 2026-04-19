package ELearningSystem.model;

import javax.xml.crypto.Data;
import java.sql.Timestamp;

public class Enrollment {
    private int enrollmentId;
    private int courseId;
    private String studentName;
    private String email;
    private Data enrollDate;
    private String paymentMethod;
    private String paymentStatus;
    private boolean isDeleted;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String courseName;
    private double coursePrice;

    public Enrollment() {}

    public Enrollment(int courseId, String studentName, String email,
                      Data enrollDate, String paymentMethod) {
        this.courseId = courseId;
        this.studentName = studentName;
        this.email = email;
        this.enrollDate = enrollDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = "Pending";
    }
}
