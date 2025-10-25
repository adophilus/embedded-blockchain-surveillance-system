import "@typespec/http";

using Http;

@service(#{ title: "Embedded Blockchain Surveillance System API" })
namespace ApiDocs;

@doc("API")
namespace Api {
  @example("f47ac10b-58cc-4372-a567-0e02b2c3d479")
  scalar Id extends string;

  @example("John Doe")
  scalar FullName extends string;

  @example("OFFICIAL001")
  scalar OfficerId extends string;

  @example(1761219932)
  scalar DateTime extends integer;

  @example("745731af4484f323968969eda289aeee")
  scalar Token extends string;

  @example("12345")
  scalar Otp extends string;

  model VideoFile extends File {
    contentType: "video/mp4" | "video/webm" | "video/ogg";
  }

  model ImageFile extends File {
    contentType: "image/jpeg" | "image/png" | "image/webp";
  }

  model WithoutTimestamp<T> {
    ...OmitProperties<T, "created_at" | "updated_at" | "deleted_at">;
  }

  enum Role {
    ADMIN,
    OFFICIAL,
  }

  model MediaDescription {
    @example("ipfs")
    source: string;

    @example("QmXoypizjW3WknFiJnKLwL7Qh18qJnZ7qQFp2kFmCtmDZ9")
    id: string;

    @example("https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwL7Qh18qJnZ7qQFp2kFmCtmDZ9")
    url: string;
  }

  @example("officer.johnson@police.gov")
  scalar Email extends string;

  @example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30")
  scalar Jwt extends string;

  @example("securePassword123")
  scalar Password extends string;

  @error
  model ZodFlattenedError {
    formErrors: string[];

    @example(#{ name: #["Required"], age: #["Required"] })
    fieldErrors: unknown;
  }

  @error
  model UnexpectedError {
    @statusCode _code: 500;
    code: "ERR_UNEXPECTED";
  }

  @error
  model BadRequestError {
    @statusCode _code: 400;
    code: "ERR_EXPECTED_DATA_NOT_RECEIVED";
    data: ZodFlattenedError;
  }

  @error
  model NotFoundError<T> {
    @statusCode _code: 404;
    code: "ERR_${T}_NOT_FOUND";
  }

  @error
  model UnauthorizedError {
    @statusCode _code: 401;
    code: "ERR_UNAUTHORIZED";
  }

  @error
  model ConflictError<T> {
    @statusCode _code: 409;
    code: "ERR_${T}_ALREADY_IN_USE";
  }

  @example("City Center Security Session 2024")
  scalar SessionTitle extends string;

  @example("24-hour surveillance of downtown area for crime prevention")
  scalar SessionDescription extends string;

  @example("2024-12-01T09:00:00Z")
  scalar SessionStartDate extends string;

  @example("2024-12-15T17:00:00Z")
  scalar SessionEndDate extends string;

  @example("John Smith")
  scalar CriminalName extends string;

  @example("Armed robbery, assault")
  scalar CriminalOffense extends string;

  @example("CRIMINAL001")
  scalar CriminalIdCode extends string;

  @tag("Criminal")
  @route("/criminals")
  namespace Criminal {
    model CriminalProfile {
      id: Id;
      name: CriminalName;
      aliases: string[];
      offenses: CriminalOffense[];
      mugshot: MediaDescription | null;
      created_at: DateTime;
    }

    namespace Create {
      namespace Request {
        model Body {
          name: HttpPart<CriminalName>;
          aliases: HttpPart<string[]>;
          offenses: HttpPart<CriminalOffense[]>;
          mugshot?: HttpPart<ImageFile>;
        }
      }

      namespace Response {
        namespace Success {
          model CriminalCreated {
            code: "CRIMINAL_PROFILE_UPLOADED";
          }

          alias Success = CriminalCreated;
        }

        namespace Error {
          alias Error = BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Create criminal profile")
      op createCriminal(@multipartBody body: Request.Body): Response.Response;
    }

    @route("/{criminalId}")
    namespace ById {
      namespace Request {
        model Path {
          @path
          criminalId: Id;
        }
      }

      namespace Response {
        namespace Success {
          model CriminalProfileDetails {
            code: "CRIMINAL_PROFILE_DETAILS";
            data: CriminalProfile;
          }

          alias Success = CriminalProfileDetails;
        }

        namespace Error {
          alias Error = NotFoundError<"CRIMINAL_PROFILE"> | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @doc("Get details of a specific criminal profile")
      op getCriminalById(...Request.Path): Response.Response;
    }
  }

  @tag("Authentication")
  @route("/auth")
  namespace Authentication {
    @route("/sign-in")
    namespace SignIn {
      namespace Email {
        namespace Request {
          model Body {
            email: Api.Email;
            password: Password;
          }
        }

        namespace Response {
          namespace Success {
            model AuthUser {
              id: Id;
              full_name: FullName;
              email: Api.Email;
              role: Role;
            }

            model AuthTokens {
              access_token: Jwt;
              refresh_token: Jwt;
            }

            model SignInSuccess {
              code: "SIGN_IN_SUCCESSFUL";
              data: {
                user: AuthUser;
                tokens: AuthTokens;
              };
            }

            alias Success = SignInSuccess;
          }

          namespace Error {
            @error
            model InvalidCredentialsError {
              @statusCode _code: 401;
              code: "ERR_INVALID_CREDENTIALS";
            }

            @error
            model UserNotRegisteredWithPasswordError {
              @statusCode _code: 401;
              code: "ERR_USER_NOT_REGISTERED_WITH_PASSWORD";
            }

            alias Error =
              | NotFoundError<"USER">
              | InvalidCredentialsError
              | UserNotRegisteredWithPasswordError
              | BadRequestError
              | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Sign in an existing user with email and password")
        op signIn(@body body: Request.Body): Response.Response;
      }
    }

    @useAuth(BearerAuth)
    @route("/profile")
    namespace Profile {
      namespace Response {
        namespace Success {
          model UserProfile {
            code: "USER_PROFILE";
            data: {
              role: Role.ADMIN | Role.OFFICIAL;
              id: Id;
              full_name: FullName;
              email: Api.Email;
              created_at: DateTime;
              updated_at: DateTime | null;
            };
          }

          alias Success = UserProfile;
        }

        namespace Error {
          alias Error = UnauthorizedError | NotFoundError<"USER"> | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("Get the authenticated user's profile")
      op getProfile(): Response.Response;
    }

    @route("/sign-up")
    @useAuth(BearerAuth)
    namespace SignUp {
      namespace Request {
        model Body {
          full_name: HttpPart<FullName>;
          email: HttpPart<Email>;
          password: HttpPart<Password>;
          role?: HttpPart<Role>;
        }
      }

      namespace Response {
        namespace Success {
          model UserCreated {
            code: "USER_CREATED";
          }

          alias Success = UserCreated;
        }

        namespace Error {
          alias Error =
            | ConflictError<"EMAIL">
            | BadRequestError
            | UnauthorizedError
            | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Create a new user. Requires ADMIN role.")
      op signUp(@multipartBody body: Request.Body): Response.Response;
    }
  }

  @useAuth(BearerAuth)
  @tag("Surveillance")
  @route("/surveillance")
  namespace Surveillance {
    model Session {
      id: Id;
      title: SessionTitle;
      description: SessionDescription | null;
      start_timestamp: SessionStartDate;
      end_timestamp: SessionEndDate;
      status: "UPCOMING" | "ACTIVE" | "COMPLETED";
      created_at: DateTime;
      updated_at: DateTime | null;
    }

    model SurveillanceEventDetection {
      criminal_profile_id: Id;
    }

    model SurveillanceEvent {
      id: Id;
      detections: SurveillanceEventDetection[];
      device_id: string;
      session_id: Id;
      created_at: DateTime;
    }

    namespace List {
      namespace Request {
        alias Query = Pagination.Query;
      }

      namespace Response {
        namespace Success {
          model SessionsList {
            code: "SESSIONS_LIST";
            data: Pagination.Paginated<Session>;
          }

          alias Success = SessionsList;
        }

        namespace Error {
          alias Error = BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @doc("List surveillance sessions")
      op listSessions(...Request.Query): Response.Response;
    }

    @route("/{sessionId}")
    namespace ById {
      model Path {
        @path
        sessionId: Id;
      }

      namespace Get {
        namespace Request {
          alias Path = ById.Path;
        }

        namespace Response {
          namespace Success {
            model SessionDetails {
              code: "SESSION_DETAILS";
              data: {
                session: Session;
                events: SurveillanceEvent[];
              };
            }

            alias Success = SessionDetails;
          }

          namespace Error {
            alias Error = NotFoundError<"SESSION"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @doc("Get surveillance session by id")
        op getSessionById(...Request.Path): Response.Response;
      }

      @route("/events")
      namespace Event {
        namespace List {
          namespace Request {
            alias Path = ById.Path;

            model Query {
              @query
              @minValue(1)
              page?: integer;

              @query
              @minValue(10)
              @maxValue(100)
              per_page?: integer;

              @query
              start_date?: DateTime;

              @query
              end_date?: DateTime;

              @query
              detected?: boolean;
            }
          }

          namespace Response {
            namespace Success {
              model EventsList {
                code: "EVENTS_LIST";
                data: Pagination.Paginated<SurveillanceEvent>;
              }
              alias Success = EventsList;
            }

            namespace Error {
              alias Error = NotFoundError<"SESSION"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @doc("List surveillance events for a specific session")
          op listEvents(...Request.Path, ...Request.Query): Response.Response;
        }
      }
    }

    @route("/metrics")
    namespace Metrics {
      namespace Response {
        namespace Success {
          model SurveillanceMetrics {
            code: "SURVEILLANCE_METRICS";
            data: {
              total_sessions: int32;
              active_sessions: int32;
              completed_sessions: int32;
              total_events: int32;
              total_detections: int32;
            };
          }
          alias Success = SurveillanceMetrics;
        }
        namespace Error {
          alias Error = UnexpectedError;
        }
        alias Response = Success.Success | Error.Error;
      }

      @doc("Get platform-wide surveillance metrics")
      op getPlatformSurveillanceMetrics(): Response.Response;
    }
  }

  @useAuth(BearerAuth)
  @tag("IoT")
  @route("/iot")
  namespace IoT {
    @route("/stream")
    namespace Stream {
      @route("/{deviceId}")
      namespace ById {
        @route("/upload")
        namespace Upload {
          namespace Request {
            model Path {
              @path
              deviceId: string;
            }

            model Headers {
              @header
              authorization: string;
            }

            model Body {
              image: HttpPart<ImageFile>;
            }
          }

          namespace Response {
            namespace Success {
              model StreamUploadSuccess {
                code: "STREAM_UPLOADED";
              }
              alias Success = StreamUploadSuccess;
            }

            namespace Error {
              alias Error = NotFoundError<"DEVICE"> | BadRequestError | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Upload surveillance stream from IoT device. IoT devices use this endpoint to send captured images to the cloud server.")
          op uploadStream(
            ...Request.Path,
            ...Request.Headers,
            @multipartBody body: Request.Body,
          ): Response.Response;
        }

        @route("/heartbeat")
        namespace Heartbeat {
          namespace Request {
            model Path {
              @path
              deviceId: string;
            }

            model Headers {
              @header
              authorization: string;
            }

            model Body {
              battery_level?: int32;
              signal_strength?: int32;
            }
          }

          namespace Response {
            namespace Success {
              model HeartbeatSuccess {
                code: "HEARTBEAT_RECEIVED";
              }
              alias Success = HeartbeatSuccess;
            }

            namespace Error {
              alias Error = NotFoundError<"DEVICE"> | BadRequestError | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Send heartbeat signal from IoT device to indicate it is still active.")
          op sendHeartbeat(
            ...Request.Path,
            ...Request.Headers,
            @body body: Request.Body,
          ): Response.Response;
        }
      }
    }
  }

  namespace Pagination {
    model Options {
      page: int64;
      per_page: int64;
    }

    model Meta {
      ...Options;
      total: int64;
    }

    model Paginated<T> {
      data: T[];
      meta: Meta;
    }

    model Query {
      @query
      @minValue(1)
      page?: integer;

      @query
      @minValue(10)
      @maxValue(100)
      per_page?: integer;
    }
  }
}
