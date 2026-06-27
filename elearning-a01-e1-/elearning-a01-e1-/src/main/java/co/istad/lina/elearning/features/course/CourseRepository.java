package co.istad.lina.elearning.features.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    boolean existsBySlug(String slug);

    // Use named query
    List<Course> allCourses();

    Course byId(Integer id);

}
