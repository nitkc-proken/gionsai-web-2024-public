FROM gcc:bookworm
RUN git clone --recursive https://github.com/google/woff2.git
WORKDIR /woff2
RUN make clean all
ENV PATH="/woff2:${PATH}"
WORKDIR /work
CMD ["tail","-f","/dev/null"]