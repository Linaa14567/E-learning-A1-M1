package model.serview;

import mapper.StudentMapper;
import model.dao.StudentDao;
import model.dto.StudentRequestDto;
import model.dto.StudentResponseDto;
import model.entities.Student;

import java.util.List;
import java.util.stream.Stream;

import static java.lang.StableValue.map;
import static java.util.stream.Collectors.toList;

public class StudentServiceImpl implements StudentService {

    private final StudentDao dao;
    private final StudentMapper mapper;

    public StudentServiceImpl(StudentDao dao, StudentMapper mapper){
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public StudentResponseDto createStudent(StudentRequestDto requestDto) {

        Student student = mapper.formStudentRequestDto(requestDto);

        Student savedStudnet =  dao.save(student);

        return mapper.toStudentResponse(savedStudnet);
    }

    @Override
    public List<StudentResponseDto> getAllStudents() {
        return dao.getAll().stream() Stream<Student>
                .map(mapper::toStudentResponse) Stream<StudentResponseDto>
                .toList();

    }
}
