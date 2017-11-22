package com.kubawach.nfs.studio.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class CommonRestConfiguration {
    
	@Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
		//objectMapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);
        return objectMapper;
    }

	@Bean(name = "mappingMessageConverter")
    public HttpMessageConverter<?> mappingJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper());
        return converter;
    }
	
	@Configuration
	public static class RestResourceConfig extends WebMvcConfigurerAdapter {

		@Autowired HttpMessageConverter<?> converter;
		
	    @Override
	    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
	        converters.add(converter);
	    }
	}
}

