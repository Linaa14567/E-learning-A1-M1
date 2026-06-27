package co.istad.lina.elearning.features.enrollment;

import co.istad.lina.elearning.config.auditing.BasedEntity;
import co.istad.lina.elearning.features.course.Course;
import co.istad.lina.elearning.features.student.StudentProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "enrollments")
public class Enrollment extends BasedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private StudentProfile studentProfile;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private Boolean paymentStatus;
    private String paymentMethod;
    private LocalDateTime paymentAt;
    private LocalDateTime enrolledAt;
}
