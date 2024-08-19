package com.mamdaero.domain.member.security.repository;

import com.mamdaero.domain.member.security.entity.CounselorAuth;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CounselorAuthRepository extends JpaRepository<CounselorAuth, Long>
{
    boolean existsByEmail(String email);
    @Query("SELECT c FROM CounselorAuth c WHERE c.email = :email AND c.roleNumber = :roleNumber AND c.name = :name")
    CounselorAuth findByInfo(@Param("email") String email, @Param("roleNumber") String role_number, @Param("name") String name);
    @Query("SELECT c FROM CounselorAuth c WHERE c.email = :email AND c.authToken = :auth_Token")
    CounselorAuth findByEmail(@Param("email") String email, @Param("auth_Token") String auth_Token);
    @Query("SELECT c.authToken FROM CounselorAuth c WHERE c.email = :email")
    String findTokenByEmail(@Param("email") String email);
    @Query("SELECT c.email FROM CounselorAuth c WHERE c.email = :email AND c.authToken = :auth_Token")
    String verifyAuthToken(@Param("auth_Token") String auth_Token, @Param("email") String email);
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("UPDATE CounselorAuth SET authToken = :token WHERE email = :email")
    void updatePassword(@Param("token") String token, @Param("email") String email);
}
