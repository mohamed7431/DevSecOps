package com.company.employee.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(
        classes = SecurityConfigTest.TestApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.MOCK
)
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @SpringBootApplication(exclude = {
            DataSourceAutoConfiguration.class,
            DataSourceTransactionManagerAutoConfiguration.class,
            HibernateJpaAutoConfiguration.class
    })
    static class TestApplication {
    }

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Test
    void shouldCreateAdminUser() {

        UserDetails admin =
                userDetailsService.loadUserByUsername("admin");

        assertNotNull(admin);
        assertEquals("admin", admin.getUsername());

        assertTrue(admin.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void shouldLoadSecurityFilterChain() {

        assertNotNull(securityFilterChain);
    }
}
