package com.tenantlens.userservice.security;

import com.tenantlens.userservice.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Get Authorization header
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;

        // Check if header starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
            } catch (Exception e) {
                // Invalid token - just continue without setting authentication
                System.out.println("Invalid JWT token: " + e.getMessage());
            }
        }

        // If email found and no authentication set yet
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Check if user exists in database
                boolean userExists = userRepository.existsByEmail(email);

                if (userExists && jwtUtil.isTokenValid(token, email)) {
                    // Set authentication in security context
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                System.out.println("Error validating token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}