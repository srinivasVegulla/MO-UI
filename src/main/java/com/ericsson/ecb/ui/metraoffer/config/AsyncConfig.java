package com.ericsson.ecb.ui.metraoffer.config;

import java.util.concurrent.Executor;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync(proxyTargetClass = true) // detects @Async annotation
public class AsyncConfig implements AsyncConfigurer {

  @Bean
  public Executor threadPoolTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(10); // create 10 Threads at the time of initialization
    executor.setQueueCapacity(10); // queue capacity
    executor.setMaxPoolSize(25); // if queue is full, then it will create new thread and go till 25
    executor.setThreadNamePrefix("MoAsync-Thread-");
    executor.initialize();// Set up the ExecutorService.
    return executor;
  }

  @Override
  public Executor getAsyncExecutor() {
    return threadPoolTaskExecutor();
  }

  @Override
  public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
    return null;
  }

}
