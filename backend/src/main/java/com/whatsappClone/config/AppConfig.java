package com.whatsappClone.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize.requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(new CorsConfigurationSource() {
                    @SuppressWarnings("null")
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration cfg = new CorsConfiguration();

                        // Permitir las direcciones IP necesarias
                        cfg.setAllowedOrigins(Arrays.asList(
                                "http://localhost:3000", // Para desarrollo local
                                "http://192.168.1.15:3000" // Cambia esto por la IP de tu computadora en tu red local
                        ));

                        // También puedes usar patrones
                        cfg.setAllowedOriginPatterns(Arrays.asList(
                                "http://localhost:3000",
                                "http://192.168.1.15:3000" // Patrones para más flexibilidad
                        ));

                        cfg.setAllowedMethods(Collections.singletonList("*"));
                        cfg.setAllowedHeaders(Collections.singletonList("*"));
                        cfg.setExposedHeaders(Arrays.asList("Authorization"));
                        cfg.setAllowCredentials(true); // Permitir cookies o credenciales si es necesario
                        cfg.setMaxAge(3600L);

                        return cfg;
                    }
                })).formLogin(Customizer.withDefaults()).httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
