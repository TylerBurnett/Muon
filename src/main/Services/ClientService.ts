export default interface ClientService {
  startApp(): void;

  getId(): number | undefined;
}
