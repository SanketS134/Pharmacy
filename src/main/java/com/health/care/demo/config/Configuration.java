package com.health.care.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@org.springframework.context.annotation.Configuration
@EnableWebMvc
public class Configuration {
	
	@Bean

	public CorsFilter corsFilter() {

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		CorsConfiguration config = new CorsConfiguration();

		config.setAllowCredentials(true);

		config.addAllowedOriginPattern("*"); // Whitelist your front-end URL

		config.addAllowedHeader("*");

		config.addAllowedMethod("GET");

		config.addAllowedMethod("POST");

		config.addAllowedMethod("PUT");

		config.addAllowedMethod("DELETE");

		source.registerCorsConfiguration("/**", config);

		return new CorsFilter(source);

	}
	
	

}
