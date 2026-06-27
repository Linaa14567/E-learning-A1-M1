package co.istad.lina.elearning.features.course;

import co.istad.lina.elearning.features.course.dto.CourseResponse;
import co.istad.lina.elearning.features.course.dto.CreateCourseRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    Course mapCreateCourseRequestToCourse(CreateCourseRequest createCourseRequest);

    CourseResponse mapCourseToCourseResponse(Course course);

}
