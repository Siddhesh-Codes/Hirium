package hrms.hrms.security.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;

import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.security.jwt.JwtAuthenticationFilter;
import hrms.hrms.security.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            ErrorResult errorResult = new ErrorResult("Unauthorized: Authentication token is missing, invalid, or expired.");
            response.getWriter().write(objectMapper.writeValueAsString(errorResult));
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            ErrorResult errorResult = new ErrorResult("Forbidden: You do not have permission to perform this action.");
            response.getWriter().write(objectMapper.writeValueAsString(errorResult));
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler())
                )
                .authorizeHttpRequests(auth -> auth
                        // Public Auth & Error Endpoints
                        .requestMatchers("/api/auth/**", "/error").permitAll()

                        // Public Read-Only Metadata & Job Board Endpoints
                        .requestMatchers(HttpMethod.GET, "/api/cities/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobPosition/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobPost/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobAdvertisements/**").permitAll()

                        // Existing Registration & Public List Endpoints for compatibility
                        .requestMatchers(HttpMethod.POST, "/api/employers/register", "/api/candidateController/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/employers/getAll", "/api/candidateController/getAll").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cities/add", "/api/jobPosition/add").permitAll()
                        .requestMatchers("/api/hrController/**").permitAll()

                        // Employer specific protected endpoints
                        .requestMatchers(HttpMethod.POST, "/api/jobPost/add", "/api/jobAdvertisements/add").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.POST, "/api/applications/update-status").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.GET, "/api/applications/by-advertisement/**").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.GET, "/api/jobPost/active/by-employer", "/api/jobAdvertisements/active/by-employer").hasRole("EMPLOYER")

                        // Job Seeker specific protected endpoints
                        .requestMatchers(HttpMethod.POST, "/api/applications/apply").hasRole("JOB_SEEKER")
                        .requestMatchers(HttpMethod.GET, "/api/applications/by-jobseeker/**").hasRole("JOB_SEEKER")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .toList();
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin", "Cookie"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Set-Cookie"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
