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

  @example("2021-09-01T12:00:00Z")
  scalar DateTime extends string;

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
    SYSTEM,
  }

  model MediaDescription {
    @example("ipfs")
    source: "ipfs";

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


  @tag("Authentication")
  @route("/auth")
  namespace Authentication {
    @route("/sign-in")
    namespace SignIn {
      @route("/email")
      namespace Email {
        namespace Request {
          model Body {
            email: Api.Email;
            password: Password;
          }
        }

        namespace Response {
          namespace Success {
            model SignInSuccess {
              code: "SIGN_IN_SUCCESSFUL";
              data: {
                user: {
                  id: Id;
                  full_name: FullName;
                  email: Api.Email;
                  role: Role;
                };
                tokens: {
                  access_token: Jwt;
                  refresh_token: Jwt;
                };
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

    model SurveillanceEvent {
      id: Id;
      session_id: Id;
      device_id: string;
      timestamp: DateTime;
      detected: boolean;
      ipfs_cid: string | null;
      ipfs_url: string | null;
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

      namespace Update {
        namespace Request {
          alias Path = ById.Path;
          alias Body = OptionalProperties<Create.Request.Body>;
        }

        namespace Response {
          namespace Success {
            model SessionUpdated {
              code: "SESSION_UPDATED";
            }

            alias Success = SessionUpdated;
          }

          namespace Error {
            alias Error = BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @patch(#{ implicitOptionality: false })
        @doc("Update a surveillance session")
        op updateSessionById(
          ...Request.Path,
          @body body: Request.Body,
        ): Response.Response;
      }

      namespace Delete {
        namespace Request {
          alias Path = ById.Path;
        }

        namespace Response {
          namespace Success {
            model SessionDeleted {
              code: "SESSION_DELETED";
            }
            alias Success = SessionDeleted;
          }

          namespace Error {
            alias Error = NotFoundError<"SESSION"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @delete
        @doc("Delete a surveillance session by ID.")
        op deleteSessionById(...Request.Path): Response.Response;
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

        @route("/ai-detection")
        namespace AIDetection {
          namespace Request {
            alias Path = ById.Path;

            model Body {
              image_url: string;
              session_id: Id;
              timestamp: DateTime;
            }
          }

          namespace Response {
            namespace Success {
              model AIDetectionResult {
                code: "AI_DETECTION_COMPLETED";
                data: {
                  detected: boolean;
                  matches: Api.Surveillance.Criminal.Criminal[];
                  confidence: float64;
                  ipfs_cid: string | null;
                  ipfs_url: string | null;
                };
              }
              alias Success = AIDetectionResult;
            }

            namespace Error {
              alias Error = NotFoundError<"SESSION"> | BadRequestError | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Perform AI detection on image to check for criminals in the criminal database.")
          op performAIDetection(
            ...Request.Path,
            @body body: Request.Body,
          ): Response.Response;
        }



  @tag("Criminal")
  @route("/criminals")
  namespace Criminal {
    model Criminal {
      id: Id;
      name: CriminalName;
      aliases: string[];
      offense: CriminalOffense | null;
      mugshot: MediaDescription | null;
      created_at: DateTime;
    }

    namespace Create {
      namespace Request {
        model CriminalPayload {
          name: CriminalName;
          aliases?: string[];
          offense?: CriminalOffense;
          mugshot?: MediaDescription;
        }

        model Body {
          criminals: CriminalPayload[];
        }
      }

      namespace Response {
        namespace Success {
          model CriminalCreated {
            code: "CRIMINALS_LIST";
            data: Criminal[];
          }

          alias Success = CriminalCreated;
        }

        namespace Error {
          alias Error = BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Create criminal profiles")
      op createCriminal(
        @body body: Request.Body,
      ): Response.Response;
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
          model CriminalDetails {
            code: "CRIMINAL_DETAILS";
            data: Criminal;
          }

          alias Success = CriminalDetails;
        }

        namespace Error {
          alias Error = NotFoundError<"CRIMINAL"> | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @doc("Get details of a specific criminal")
      op getCriminalById(...Request.Path): Response.Response;
    }
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
              timestamp: HttpPart<DateTime>;
              session_id: HttpPart<Id>;
            }
          }

          namespace Response {
            namespace Success {
              model StreamUploadSuccess {
                code: "STREAM_UPLOADED";
                data: {
                  event_id: Id;
                  ipfs_cid: string;
                  ipfs_url: string;
                  detected: boolean;
                  timestamp: DateTime;
                };
              }
              alias Success = StreamUploadSuccess;
            }

            namespace Error {
              alias Error = BadRequestError | UnexpectedError;
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
              status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
              timestamp: DateTime;
              battery_level?: int32;
              signal_strength?: int32;
            }
          }

          namespace Response {
            namespace Success {
              model HeartbeatSuccess {
                code: "HEARTBEAT_RECEIVED";
                data: {
                  device_id: string;
                  timestamp: DateTime;
                  acknowledged: boolean;
                };
              }
              alias Success = HeartbeatSuccess;
            }

            namespace Error {
              alias Error = BadRequestError | UnexpectedError;
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

