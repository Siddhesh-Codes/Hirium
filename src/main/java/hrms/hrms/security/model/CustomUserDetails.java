package hrms.hrms.security.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {

    private final Integer id;
    private final String email;
    private final String password;
    private final UserRole role;
    private final String name;
    private final Boolean passwordChangeRequired;

    public CustomUserDetails(Integer id, String email, String password, UserRole role, String name) {
        this(id, email, password, role, name, false);
    }

    public CustomUserDetails(Integer id, String email, String password, UserRole role, String name, Boolean passwordChangeRequired) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.passwordChangeRequired = passwordChangeRequired != null ? passwordChangeRequired : false;
    }

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    public Boolean getPasswordChangeRequired() {
        return passwordChangeRequired;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
