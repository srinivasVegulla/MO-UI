# Pull base image.
FROM arc-tp-poc01.metratech.com:5000/ericssonmetratech/jre8:latest

# Install EUREKA REGISTRY.
MAINTAINER George Wilk

ENV APPATH /usr/local/ericsson

RUN mkdir -p $APPATH

ADD build/libs/ecb-metraoffer-ui*.jar $APPATH/ecb-metraoffer-ui*.jar

EXPOSE 8080
EXPOSE 22

WORKDIR /usr/local/ericsson
CMD ["java", "-Djavax.net.ssl.trustStorePassword=ecbapipwd", \
             "-Djavax.net.ssl.trustStore=/ecb/ecbkeystore.jks", \
             "-Djavax.net.ssl.keyStorePassword=ecbapipwd", \
             "-Djavax.net.ssl.keyStore=/ecb/ecbkeystore.jks", \
             "-jar", "ecb-metraoffer-ui*.jar", \
             "--server.port=8080", \
             "--spring.profiles.active=${APP_PROFILE}", \
             "--spring.cloud.config.uri=${CONFIG_URI}", \
             "--spring.cloud.config.label=${CONFIG_LABEL}"]

