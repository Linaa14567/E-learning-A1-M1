package co.istad.lina.elearning.features.course;

import co.istad.lina.elearning.features.course.dto.CourseResponse;
import co.istad.lina.elearning.features.course.dto.CreateCourseRequest;
import org.springframework.security.oauth2.jwt.Jwt;

public interface CourseService {

    // Create a new course
    CourseResponse createCourse(CreateCourseRequest createCourseRequest, Jwt jwt);

}
