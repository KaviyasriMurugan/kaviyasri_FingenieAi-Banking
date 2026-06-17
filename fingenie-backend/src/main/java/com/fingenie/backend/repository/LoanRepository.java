package com.fingenie.backend.repository;
 
import com.fingenie.backend.entity.LoanApplication;
import com.fingenie.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
 
@Repository
public interface LoanRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByUser(User user);
}