FROM php:8.2-fpm-alpine
RUN docker-php-ext-install mysqli
CMD ["php-fpm", "-F"]