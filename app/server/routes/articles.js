// @ts-check

import { eq } from "drizzle-orm";
import i18next from "i18next";

const required = (value) => typeof value === "string" && value.trim() !== "";

// Ошибки собираются в том виде, в котором их читают шаблоны: список записей с
// полем `path` и сообщением. Раньше такой список отдавал sequelize из правил
// модели, теперь правила заданы явно.
const validate = (data) =>
  [
    required(data.title) ? null : { path: "title", message: "Не должно быть пустым" },
    required(data.content) ? null : { path: "content", message: "Не должно быть пустым" },
  ].filter(Boolean);

export default (app) => {
  const { articles } = app.schema;

  const findArticle = (id) =>
    app.db.query.articles.findFirst({ where: eq(articles.id, Number(id)) });

  app
    .get("/articles", { name: "articles" }, async (req, reply) => {
      reply.render("articles/index", { articles: await app.db.select().from(articles) });
      return reply;
    })
    .get("/articles/new", { name: "newArticle" }, (req, reply) => {
      reply.render("articles/new", { article: {} });
    })
    .post("/articles", async (req, reply) => {
      const { data } = req.body;
      const errors = validate(data);

      if (errors.length > 0) {
        req.flash("error", i18next.t("views.article.create.error"));
        reply.code(422);
        reply.render("articles/new", { article: data, errors });
        return reply;
      }

      await app.db.insert(articles).values({ title: data.title, content: data.content });
      req.flash("info", i18next.t("views.article.create.success"));
      reply.redirect(app.reverse("articles"));
      return reply;
    })
    .get("/articles/:id", { name: "article" }, async (req, reply) => {
      reply.render("articles/show", { article: await findArticle(req.params.id) });
      return reply;
    })
    .get("/articles/:id/edit", { name: "editArticle" }, async (req, reply) => {
      reply.render("articles/edit", { article: await findArticle(req.params.id) });
      return reply;
    })
    .patch("/articles/:id", async (req, reply) => {
      const id = Number(req.params.id);
      const { data } = req.body;
      const errors = validate(data);

      if (errors.length > 0) {
        req.flash("error", i18next.t("views.article.edit.error"));
        reply.code(422);
        reply.render("articles/edit", { article: { ...data, id }, errors });
        return reply;
      }

      await app.db
        .update(articles)
        .set({ title: data.title, content: data.content, updatedAt: new Date() })
        .where(eq(articles.id, id));

      req.flash("info", i18next.t("views.article.edit.success"));
      reply.redirect(app.reverse("articles"));
      return reply;
    })
    .delete("/articles/:id", async (req, reply) => {
      await app.db.delete(articles).where(eq(articles.id, Number(req.params.id)));
      req.flash("info", i18next.t("views.article.delete.success"));
      reply.redirect(app.reverse("articles"));
      return reply;
    });
};
