package co.istad.elearninga01m1.features.comment;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class Comment {

    private Integer id;
    private String text;
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Comment parentComment;
}
