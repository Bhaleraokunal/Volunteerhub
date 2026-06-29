package com.community.volunteerhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.community.volunteerhub.entity.UserDetails;

public interface UserDetailsRepository extends JpaRepository<UserDetails, String> {

}
