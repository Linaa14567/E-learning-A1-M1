package co.istad.lina.elearning;

import co.istad.lina.elearning.features.course.Course;
import co.istad.lina.elearning.features.course.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.List;

@EnableJpaAuditing
@SpringBootApplication
public class ElearningA01M1Application implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(ElearningA01M1Application.class, args);
    }

    private CourseRepository courseRepository;

    @Autowired
    public void setCourseRepository(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        List<Course> courses = courseRepository.allCourses();
        Course course = courseRepository.byId(2);

        IO.print(course.getTitle());

        courses.forEach(course1 -> IO.print(course1.getTitle()));
    }

}
