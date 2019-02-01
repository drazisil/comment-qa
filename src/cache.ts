import * as request from "request";

export class Cache {
  public async fetchTickets(
    tickets: any[],
    url: string,
    zendeskEmail: any,
    zendeskApiToken: any,
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      request.get(
        url,
        {
          auth: {
            pass: zendeskApiToken,
            sendImmediately: false,
            user: `${zendeskEmail}/token`,
          },
        },
        async (error, response, body) => {
          if (error) {
            reject(error);
          }
          const info = JSON.parse(body);
          if (info.error) {
            reject(info.error);
          }
          tickets = tickets.concat(info.results);
          if (info.next_page) {
            resolve(
              await this.fetchTickets(
                tickets,
                info.next_page,
                zendeskEmail,
                zendeskApiToken,
              ),
            );
          }
          resolve(tickets);
        },
      );
    });
  }
}
